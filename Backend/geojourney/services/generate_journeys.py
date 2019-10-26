import requests
from django.conf import settings

import geojourney.services.triangulation as tri

MAX_PLACES = 20
MAX_DISTANCE = 20.0
MAX_DURATION = 9999


def __sign(p1, p2, p3):
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)


def __is_in_triangle(point, triangle):
    det1 = __sign(point, triangle[0], triangle[1])
    det2 = __sign(point, triangle[1], triangle[2])
    det3 = __sign(point, triangle[2], triangle[0])

    has_neg = det1 < 0 or det2 < 0 or det3 < 0
    has_pos = det1 > 0 or det2 > 0 or det3 > 0

    return not (has_neg and has_pos)


def total_weight(path):
    return sum(map(lambda point: point.weight, path))


def dfs_path(point, duration_lim, current_duration, distance_lim, current_distance, goal=None, path=None):
    if path is None:
        path = [goal]

    if goal is not None and point == goal:
        yield path

    succeeding = point.edge.next
    if succeeding not in set(path):
        fit_duration = duration_lim < current_duration + point.edge.duration
        fit_distance = distance_lim < current_distance + point.edge.distance
        if fit_duration and fit_distance:
            yield from dfs_path(succeeding,
                                duration_lim, current_duration + point.edge.duration,
                                distance_lim, current_distance + point.edge.distance,
                                goal, path + [succeeding])
        elif goal is None:
            yield path

    previous = point.edge.previous
    if previous not in set(path):
        fit_duration = duration_lim < current_duration + previous.edge.duration
        fit_distance = distance_lim < current_distance + previous.edge.distance
        if fit_duration and fit_distance:
            yield from dfs_path(previous,
                                duration_lim, current_duration + previous.edge.duration,
                                distance_lim, current_distance + previous.edge.distance,
                                goal, path + [previous])
        elif goal is None:
            yield path


def find_best_journey(start, duration_limit, distance_limit, end=None):
    all_paths = list(dfs_path(start, duration_limit, 0, distance_limit, 0, end))
    if all_paths is None:
        return []

    return all_paths.sort(key=total_weight, reverse=True)[0]


class JourneyGenerator:
    triangulation = None

    def __init__(self, points):
        coordinates = [[point.x, point.y] for point in points]
        if self.triangulation is None:
            vertices, edges, faces, enclosing_points = tri.compute_triangulation(points)
            or index, vertex in enumerate(vertices):
                vertex.weight = points[index].weight

            edges_set = get_edges_list(edges)
            query = '&'.join(['start{}={},{}&destination{}:{},{}'.format(ind, edg[0].origin.x, edg[0].origin.y,
                ind, edg[1].origin.x, edg[1].origin.y) for ind, edg in enumerate(edges_set)]
            response = requests.get('https://matrix.route.api.here.com/routing/7.2/calculatematrix.json'
                                                               '?app_id={}&app_code={}&{}'
                                                               '&mode=fastest;pedestrian;traffic:disabled
                                                               '&summaryAttributes=costfactor,distance'
                                                               .format(settings.APP_ID, settings.APP_CODE, query))
            get_routes = response.json()
            relevant_routes = filter(lambda route: route['summary']['startIndex'] == route['summary']['destinationIndex'], get_routes['matrixEntry'])
            for route in relevant_routes:
                summary = route['summary']
                ind, distance, costFactor = summary['startIndex'], summary['distance'], summary['costFactor']
                edges[ind].distance = distance / 1000  # route[0]
                edges[ind].duration = costFactor / 60
            self.triangulation = {'vertices': vertices,
                                              'edges': edges,
                                              'faces': faces,
                                              'enclosing_points': enclosing_points}
            print(self.triangulation)


    def get_edges_list(edges):
        pairs = set()
        for edge in edges:
            pairs.add((edge, edge.next))
            pairs.add((edge.previous, edge))
        return list(all_pairs)

    def get_bound_triangle(self, point):
        bound_face = self.triangulation['faces'][0]
        bound_triangle = tri.find_triangle(bound_face, point)

        return bound_triangle

    def get_journey(self, start_point, end_point=None, duration=None, distance=None, is_cycle=False):
        if duration is None and distance is None:
            raise Exception('You should provide at least one parameter, duration or distance')

        if duration is None:
            duration = MAX_DURATION

        if distance is None:
            distance = MAX_DISTANCE

        start_triangle = self.get_bound_triangle(start_point)
        if is_cycle:
            return max([find_best_journey(start, duration, distance, end)
                        for start in start_triangle for end in start_triangle], key=total_weight)
        elif end_point is not None:
            end_triangle = self.get_bound_triangle(end_point)
            return max([find_best_journey(start, duration, distance, end)
                        for start in start_triangle for end in end_triangle], key=total_weight)
        else:
            return max([find_best_journey(start, duration, distance) for start in start_triangle], key=total_weight)
