from datetime import datetime

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
    print(sum(map(lambda point: point.weight if point.weight is not None else 0, path)))
    return sum(map(lambda point: point.weight if point.weight is not None else 0, path))


def dfs_path(point, duration_lim, current_duration, distance_lim, current_distance, goal=None, path=None):
    if path is None:
        path = [point]

    if goal is not None and point == goal:
        yield path

    if point is not None and point.edge is not None and point.edge.next is not None:
        succeeding = point.edge.next
        if succeeding.origin not in set(path):
            if point.edge.duration is None:
                point.edge.duration = 0
            if point.edge.distance is None:
                point.edge.distance = 0
            fit_duration = duration_lim >= current_duration + point.edge.duration
            fit_distance = distance_lim >= current_distance + point.edge.distance
            new_path = path + [succeeding.origin] if succeeding.origin.x > 0 and succeeding.origin.y > 0 else path
            if fit_duration and fit_distance and point != succeeding.origin:
                yield from dfs_path(succeeding.origin,
                                    duration_lim, current_duration + point.edge.duration,
                                    distance_lim, current_distance + point.edge.distance,
                                    goal, new_path)
            elif goal is None:
                yield path

    if point is not None and point.edge is not None and point.edge.previous is not None:
        previous = point.edge.previous
        if previous.origin not in set(path):
            if previous.origin.edge.duration is None:
                previous.origin.edge.duration = 0
            if previous.origin.edge.distance is None:
                previous.origin.edge.distance = 0
            fit_duration = duration_lim >= current_duration + previous.origin.edge.duration
            fit_distance = distance_lim >= current_distance + previous.origin.edge.distance
            new_path = path + [previous.origin] if previous.origin.x > 0 and previous.origin.y > 0 else path
            if fit_duration and fit_distance and point != previous.origin:
                yield from dfs_path(previous.origin,
                                    duration_lim, current_duration + previous.origin.edge.duration,
                                    distance_lim, current_distance + previous.origin.edge.distance,
                                    goal, new_path)
            elif goal is None:
                yield path


def find_best_journey(start, duration_limit, distance_limit, end=None):
    all_paths = list(dfs_path(start, duration_limit, 0, distance_limit, 0, end))
    if all_paths is None or len(all_paths) == 0:
        return []

    all_paths.sort(key=total_weight, reverse=True)
    return all_paths[0]


class JourneyGenerator:
    triangulation = None

    def __init__(self, points):
        if self.triangulation is None:
            vertices, edges, faces, enclosing_points = tri.compute_triangulation(points)
            for index, vertex in enumerate(vertices):
                vertex.weight = points[index].weight

            edges_set = self.get_edges_list(edges)
            get_routes = []
            ext = 15
            left = right = 0
            now = datetime.now()
            for i in range(len(edges_set) // 15):
                left = i * ext
                right = left + ext
                query = '&'.join(['start{}={},{}&destination{}={},{}'.format(ind, edg[0].origin.x, edg[0].origin.y,
                                                                             ind, edg[1].origin.x, edg[1].origin.y) for
                                  ind, edg in enumerate(edges_set[left:right])])
                response = requests.get('https://matrix.route.api.here.com/routing/7.2/calculatematrix.json'
                                        '?app_id={}&app_code={}&{}'
                                        '&mode=fastest;pedestrian;traffic:disabled'
                                        '&summaryAttributes=costfactor,distance'
                                        .format(settings.APP_ID, settings.APP_CODE, query))
                if len(get_routes) == 0:
                    get_routes = list(map(lambda elem: {'distance': elem['summary']['distance'],
                                                        'costFactor': elem['summary']['costFactor'],
                                                        'startIndex': elem['startIndex'] + left,
                                                        'destinationIndex': elem['destinationIndex'] + left},
                                          response.json()['response']['matrixEntry']))
                else:
                    resp = response.json()['response']['matrixEntry']
                    resp_mapped = map(lambda elem: {'distance': elem['summary']['distance'],
                                                    'costFactor': elem['summary']['costFactor'],
                                                    'startIndex': elem['startIndex'] + left,
                                                    'destinationIndex': elem['destinationIndex'] + left},
                                      resp)
                    get_routes.extend(resp_mapped)
            query = '&'.join(['start{}={},{}&destination{}={},{}'.format(ind, edg[0].origin.x, edg[0].origin.y,
                                                                        ind, edg[1].origin.x, edg[1].origin.y) for
                             ind, edg in enumerate(edges_set[right:len(edges_set)])])
            response = requests.get('https://matrix.route.api.here.com/routing/7.2/calculatematrix.json'
                                    '?app_id={}&app_code={}&{}'
                                    '&mode=fastest;pedestrian;traffic:disabled'
                                    '&summaryAttributes=costfactor,distance'
                                    .format(settings.APP_ID, settings.APP_CODE, query))
            resp = response.json()['response']['matrixEntry']
            resp_mapped = map(lambda elem: {'distance': elem['summary']['distance'],
                                            'costFactor': elem['summary']['costFactor'],
                                            'startIndex': elem['startIndex'] + right,
                                            'destinationIndex': elem['destinationIndex'] + right},
                              resp)
            get_routes.extend(resp_mapped)

            print(datetime.now() - now)
            relevant_routes = list(filter(lambda elem: elem['startIndex'] == elem['destinationIndex'],
                                          get_routes))
            for route in relevant_routes:
                ind, distance, costFactor = route['startIndex'], route['distance'], route['costFactor']
                edges[ind].distance = distance / 1000  # route[0]
                edges[ind].duration = costFactor / 60
            self.triangulation = {'vertices': vertices,
                                  'edges': edges,
                                  'faces': faces,
                                  'enclosing_points': enclosing_points}
            print(self.triangulation)

    def get_edges_list(self, edges):
        pairs = set()
        for edge in edges:
            pairs.add((edge, edge.next))
        return list(pairs)

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
        print("start traingle")
        start_triangle = tri.get_points(self.get_bound_triangle(start_point)[0])
        start_points = filter(lambda point: point.x > 0 and point.y > 0, start_triangle)
        if is_cycle:
            print("is_cycle")
            return max([find_best_journey(start, duration, distance, end)
                        for start in start_triangle for end in start_points], key=total_weight)
        elif end_point is not None:
            print("end_point")
            end_triangle = tri.get_points(self.get_bound_triangle(end_point)[0])
            end_points = filter(lambda point: point.x > 0 and point.y > 0, end_triangle)
            return max([find_best_journey(start, duration, distance, end)
                        for start in start_points for end in end_points], key=total_weight)
        else:
            print("else")
            return max([find_best_journey(start, duration, distance) for start in start_points], key=total_weight)
