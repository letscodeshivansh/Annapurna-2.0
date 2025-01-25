#include <iostream>
#include <vector>
#include <queue>
#include <unordered_map>
#include <cmath>
#include <algorithm>

struct N {
    int x, y;
    float g, h;
    N* p;

    N(int x, int y, float g, float h, N* p = nullptr)
        : x(x), y(y), g(g), h(h), p(p) {}

    float f() const { return g + h; }

    bool operator<(const N& o) const {
        return f() > o.f();
    }
};

float h(int x1, int y1, int x2, int y2) {
    return std::sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

std::vector<N> get_n(const N& n, const std::vector<std::vector<int>>& g) {
    std::vector<N> ns;
    std::vector<std::pair<int, int>> dirs = {{1, 0}, {0, 1}, {-1, 0}, {0, -1}};

    for (auto& d : dirs) {
        int nx = n.x + d.first, ny = n.y + d.second;
        if (nx >= 0 && nx < g.size() && ny >= 0 && ny < g[0].size() && g[nx][ny] == 0) {
            ns.emplace_back(nx, ny, n.g + 1, 0, nullptr);
        }
    }
    return ns;
}

void path(N* n) {
    std::vector<std::pair<int, int>> p;
    while (n) {
        p.emplace_back(n->x, n->y);
        n = n->p;
    }
    std::reverse(p.begin(), p.end());
    for (const auto& c : p) {
        std::cout << "(" << c.first << "," << c.second << ") ";
    }
    std::cout << std::endl;
}

void astar(const std::vector<std::vector<int>>& g, int sx, int sy, int gx, int gy) {
    auto cmp = [](N* a, N* b) { return a->f() > b->f(); };
    std::priority_queue<N*, std::vector<N*>, decltype(cmp)> ol(cmp);
    std::unordered_map<int, std::unordered_map<int, N*>> all;

    N* s = new N(sx, sy, 0, h(sx, sy, gx, gy));
    ol.push(s);
    all[sx][sy] = s;

    while (!ol.empty()) {
        N* c = ol.top();
        ol.pop();

        if (c->x == gx && c->y == gy) {
            path(c);
            for (auto& r : all) {
                for (auto& col : r.second) {
                    delete col.second;
                }
            }
            return;
        }

        auto ns = get_n(*c, g);
        for (auto& n : ns) {
            n.h = h(n.x, n.y, gx, gy);
            n.p = c;

            if (!all[n.x][n.y] || n.g < all[n.x][n.y]->g) {
                N* nn = new N(n.x, n.y, n.g, n.h, c);
                ol.push(nn);
                all[n.x][n.y] = nn;
            }
        }
    }

    std::cout << "No path found" << std::endl;

    for (auto& r : all) {
        for (auto& col : r.second) {
            delete col.second;
        }
    }
}

int main() {
    std::vector<std::vector<int>> g = {
        {0, 1, 0, 0, 0},
        {0, 1, 0, 1, 0},
        {0, 0, 0, 1, 0},
        {0, 1, 1, 1, 0},
        {0, 0, 0, 0, 0}
    };

    int sx = 0, sy = 0, gx = 4, gy = 4;
    astar(g, sx, sy, gx, gy);
    return 0;
}