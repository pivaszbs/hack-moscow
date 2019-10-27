import numpy as np


class Face:
    def __init__(self, edge, children, parent):
        self.edge = edge
        self.children = children
        self.parent = parent


class Edge:
    def __init__(self, origin, face=None, next=None, previous=None):
        self.origin = origin
        self.face = face
        self.next = next
        self.previous = previous
        self.distance = None
        self.duration = None


class Point:
    def __init__(self, x, y, href=None, edge=None, weight=None):
        self.x = x
        self.y = y
        self.href = href
        self.edge = edge
        self.weight = weight

    def add(self, point):
        return Point(self.x + point.x, self.y + point.y)

    def subtract(self, point):
        return Point(self.x - point.x, self.y - point.y)

    def det(self, point):
        return self.x * point.y - self.y * point.x

    def sign(self, point1, point2):
        return self.subtract(point2).det(point1.subtract(point2))

    def is_inside_triangle(self, triangle):
        a, b, c = triangle

        sign_ab = self.sign(a, b)
        sign_bc = self.sign(b, c)
        sign_ca = self.sign(c, a)

        has_neg = sign_ab < 0 or sign_bc < 0 or sign_ca < 0
        has_pos = sign_ab > 0 or sign_bc > 0 or sign_ca > 0

        return not (has_neg and has_pos)

    def is_inside_circle(self, circle_points):
        circle_points = sort_counter_clockwise(circle_points)

        point1 = Point(circle_points[0].x, circle_points[0].y, circle_points[0].href, circle_points[0].weight)
        point2 = Point(circle_points[1].x, circle_points[1].y, circle_points[1].href, circle_points[1].weight)
        point3 = Point(circle_points[2].x, circle_points[2].y, circle_points[2].href, circle_points[2].weight)

        matrix = np.array([
            [point1.x - self.x, point2.x - self.x, point3.x - self.x],
            [point1.y - self.y, point2.y - self.y, point3.y - self.y],
            [(point1.x - self.x) ** 2 + (point1.y - self.y) ** 2,
             (point2.x - self.x) ** 2 + (point2.y - self.y) ** 2,
             (point3.x - self.x) ** 2 + (point3.y - self.y) ** 2]], dtype='float')
        return np.linalg.det(matrix) >= 0

    def is_adjacent(self, a, b, vertices):
        return (is_equal(a, vertices[0]) or is_equal(a, vertices[1]) or is_equal(a, vertices[2])) \
               and (is_equal(b, vertices[0]) or is_equal(b, vertices[1]) or is_equal(b, vertices[2])) \
               and (not is_equal(self, vertices[0]) and not is_equal(self, vertices[1])
                    and not is_equal(self, vertices[2]) and not is_line(vertices))


def is_line(triangle):
    a, b, c = triangle
    vector1 = b.subtract(a)
    vector2 = c.subtract(a)

    det = vector1.det(vector2)
    return det == 0


def is_equal(point1, point2):
    return point1.x == point2.x and point1.y == point2.y


def is_left(a, b, c):
    vector1 = b.subtract(a)
    vector2 = c.subtract(a)

    return vector1.det(vector2) >= 0


def is_enclosing(triangle, enclosing_points):
    for i in range(0, len(enclosing_points)):
        if is_equal(triangle[0], enclosing_points[i]) or is_equal(triangle[1], enclosing_points[i]) \
                or is_equal(triangle[2], enclosing_points[i]):
            return True
    return False


def sort_counter_clockwise(circle_points):
    vector12 = circle_points[1].subtract(circle_points[0])
    vector13 = circle_points[2].subtract(circle_points[0])

    det = vector12.det(vector13)

    if det < 0:
        circle_points[0], circle_points[2] = circle_points[2], circle_points[0]

    return circle_points


def get_points(face):
    a = face.edge.previous.origin
    b = face.edge.origin
    c = face.edge.next.origin

    return [a, b, c]


def find_triangle(face, point):
    triangle_list = []
    if not point.is_inside_triangle(get_points(face)):
        return triangle_list

    if len(face.children) < 1:
        return [face]

    for i in range(0, len(face.children)):
        if face.children[i] is not None:
            child = face.children[i]
            triangle = find_triangle(child, point)
            for j in range(0, len(triangle)):
                triangle_list.append(triangle[j])

    return triangle_list


def compute_triangulation(points, vertices=None, edges=None, faces=None):
    if vertices is None:
        vertices = []
    if edges is None:
        edges = []
    if faces is None:
        faces = []

    min_x = -1
    min_y = -1

    max_x = 1024
    max_y = 1024

    point1 = Point(min_x, min_y)
    point2 = Point(max_x + (max_y - min_y), min_y)
    point3 = Point(min_x, max_y + (max_x - min_x))

    is_in_points1 = 0
    is_in_points2 = 0
    is_in_points3 = 0

    for i in range(0, len(points)):
        if is_equal(points[i], point1):
            is_in_points1 = 1
        if is_equal(points[i], point2):
            is_in_points2 = 1
        if is_equal(points[i], point3):
            is_in_points3 = 1

    enclosing_points = []

    if is_in_points1 == 0:
        enclosing_points.append(point1)

    if is_in_points2 == 0:
        enclosing_points.append(point2)

    if is_in_points3 == 0:
        enclosing_points.append(point3)

    points.append(point1)
    points.append(point2)
    points.append(point3)

    vertices += [[], [], []]
    edges += [[], [], []]
    faces += [[]]
    j = -3

    for i in range(len(points) - 3, len(points)):
        vertices[len(vertices) + j] = Point(points[i].x, points[i].y, points[i].href, points[i].weight)
        edges[len(edges) + j] = Edge(origin=vertices[j])
        faces[len(faces) - 1] = Face(edge=edges[0], children=[], parent=[])
        vertices[j].edge = edges[j]
        edges[j].face = faces[0]
        j += 1

    edges[len(edges) - 3].next = edges[len(edges) - 2]
    edges[len(edges) - 3].previous = edges[len(edges) - 1]
    edges[len(edges) - 2].next = edges[len(edges) - 1]
    edges[len(edges) - 2].previous = edges[len(edges) - 3]
    edges[len(edges) - 1].next = edges[len(edges) - 3]
    edges[len(edges) - 1].previous = edges[len(edges) - 2]

    for i in range(0, len(points) - 3):
        triangle = find_triangle(faces[0], points[i])
        if len(triangle) == 1 or len(triangle) == 2:
            triangle_queue = []
            vertices.append(Point(points[i].x, points[i].y, points[i].href, points[i].weight))
            vert = vertices[len(vertices) - 1]
            edges_len = len(edges)

            for m in range(0, len(triangle)):
                vert1 = triangle[m].edge.origin
                vert2 = triangle[m].edge.next.origin
                vert3 = triangle[m].edge.previous.origin

                edges.append(Edge(origin=vert1))
                edges.append(Edge(origin=vert2))
                edges.append(Edge(origin=vert))

                edges_len += 3

                edges.append(Edge(origin=vert2))
                edges.append(Edge(origin=vert3))
                edges.append(Edge(origin=vert))

                edges_len += 3

                edges.append(Edge(origin=vert3))
                edges.append(Edge(origin=vert1))
                edges.append(Edge(origin=vert))

                for j in range(edges_len - 6, edges_len + 1, 3):
                    vert1.edge = edges[j]
                    vert2.edge = edges[j + 1]
                    vert.edge = edges[j + 2]

                    edges[j].next = edges[j + 1]
                    edges[j].previous = edges[j + 2]
                    edges[j + 1].next = edges[j + 2]
                    edges[j + 1].previous = edges[j]
                    edges[j + 2].next = edges[j]
                    edges[j + 2].previous = edges[j + 1]

                    faces.append(Face(edge=edges[j], children=[], parent=[triangle[m]]))

                    edges[j].face = faces[len(faces) - 1]
                    edges[j + 1].face = faces[len(faces) - 1]
                    edges[j + 2].face = faces[len(faces) - 1]

                    triangle_queue.append(len(faces) - 1)

                    triangle[m].children += [faces[len(faces) - 1]]

            while len(triangle_queue) > 0:
                # print("{} is {}".format(i, len(points)))
                point = points[i]
                index = triangle_queue.pop()
                current_triangle_points = get_points(faces[index])

                if is_equal(current_triangle_points[0], point):
                    point1 = current_triangle_points[1]
                    point2 = current_triangle_points[2]
                elif is_equal(current_triangle_points[1], point):
                    point1 = current_triangle_points[0]
                    point2 = current_triangle_points[2]
                else:
                    point1 = current_triangle_points[0]
                    point2 = current_triangle_points[1]

                if not is_line(current_triangle_points):
                    for f in range(len(faces) - 1, -1, -1):
                        if faces[f] is not None:
                            current_face_points = get_points(faces[f])
                            if point.is_adjacent(point1, point2, current_face_points) and len(faces[f].children) == 0:

                                if is_equal(point1, current_face_points[0]) \
                                        and is_equal(point2, current_face_points[1]) \
                                        or is_equal(point2, current_face_points[0]) and is_equal(point1,
                                                                                                 current_face_points[
                                                                                                     1]):
                                    point3 = current_face_points[2]
                                elif is_equal(point1, current_face_points[2]) and is_equal(point2,
                                                                                           current_face_points[1]) \
                                        or is_equal(point2, current_face_points[2]) and is_equal(point1,
                                                                                                 current_face_points[
                                                                                                     1]):
                                    point3 = current_face_points[0]
                                else:
                                    point3 = current_face_points[1]

                                if point.is_inside_circle(current_face_points):
                                    parents = [faces[f], faces[index]]

                                    edges_len = len(edges)

                                    edges.append(Edge(origin=point))
                                    edges.append(Edge(origin=point1))
                                    edges.append(Edge(origin=point3))

                                    edges[edges_len].next = edges[edges_len + 1]
                                    edges[edges_len].previous = edges[edges_len + 2]
                                    edges[edges_len + 1].next = edges[edges_len + 2]
                                    edges[edges_len + 1].previous = edges[edges_len]
                                    edges[edges_len + 2].next = edges[edges_len]
                                    edges[edges_len + 2].previous = edges[edges_len + 1]

                                    faces.append(Face(edge=edges[edges_len], children=[], parent=parents))

                                    edges[edges_len].face = faces[len(faces) - 1]
                                    edges[edges_len + 1].face = faces[len(faces) - 1]
                                    edges[edges_len + 2].face = faces[len(faces) - 1]

                                    edges_len += 3

                                    edges.append(Edge(origin=point))
                                    edges.append(Edge(origin=point2))
                                    edges.append(Edge(origin=point3))

                                    edges[edges_len].next = edges[edges_len + 1]
                                    edges[edges_len].previous = edges[edges_len + 2]
                                    edges[edges_len + 1].next = edges[edges_len + 2]
                                    edges[edges_len + 1].previous = edges[edges_len]
                                    edges[edges_len + 2].next = edges[edges_len]
                                    edges[edges_len + 2].previous = edges[edges_len + 1]

                                    faces.append(Face(edge=edges[edges_len], children=[], parent=parents))

                                    edges[edges_len].face = faces[len(faces) - 1]
                                    edges[edges_len + 1].face = faces[len(faces) - 1]
                                    edges[edges_len + 2].face = faces[len(faces) - 1]

                                    faces[f].children += [faces[len(faces) - 1]]
                                    faces[f].children += [faces[len(faces) - 2]]
                                    faces[index].children += [faces[len(faces) - 1]]
                                    faces[index].children += [faces[len(faces) - 2]]

                                    triangle_queue.append(len(faces) - 1)
                                    triangle_queue.append(len(faces) - 2)
                                break

    def is_connect_with_enclosing(edge):
        for enclosing_point in enclosing_points:
            if is_equal(enclosing_point, edge.origin) or \
                    is_equal(enclosing_point, edge.next.origin) or \
                    is_equal(enclosing_point, edge.previous.origin):
                return True
        return False

    edges = list(filter(lambda edge: not is_connect_with_enclosing(edge), edges))
    return vertices, edges, faces, enclosing_points
