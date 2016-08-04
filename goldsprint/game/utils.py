import copy
import random

def get_random_pairs(players):
    assert len(players) % 2 == 0
    pool = copy.deepcopy(players)
    pairs = []
    while pool:
        a = pool.pop(random.randint(0, len(pool)) - 1)
        b = pool.pop(random.randint(0, len(pool)) - 1)
        pairs.append((a, b))
    return pairs
