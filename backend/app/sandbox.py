from utils import get_sprt

if __name__ == '__main__':
    confidence = 0.5
    lo = 0.8
    hi = 1.0
    results = []
    for a in range(1, 11):
        for b in range(1, 10 - a):
            prob, res = get_sprt(a, b, confidence, lo, hi)
            results.append(
                {
                    'a': a,
                    'b': b,
                    'prob': prob,
                    'eval': res.value
                }
            )
    # inspect results
    from pprint import pprint
    pprint(results)
