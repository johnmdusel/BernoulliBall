from app.utils import get_hdi

from pprint import pprint


if __name__ == "__main__":
    a = 1
    b = 1
    hdi_mass = 0.95
    width_1, (lo_1, hi_1) = get_hdi(a, b, hdi_mass)
    breakpoint()
    # workhere print diagnostics then compare pdf to samples