from app.utils import get_hdi, _sample_beta
import matplotlib.pyplot as plt
from pprint import pprint


if __name__ == "__main__":
    a = 2
    b = 2
    hdi_mass = 0.2
    width_1, (lo_1, hi_1) = get_hdi(a, b, hdi_mass)
    print(f"{100 * hdi_mass}% HDI width={width_1}, lo={lo_1}, hi={hi_1}")

    samples = _sample_beta(a, b, 10**5)
    plt.title(f"Samples from beta({a}, {b}) distribution")
    plt.xlabel("Score")
    plt.hist(samples, bins=20)
    plt.savefig(f"./beta({a}, {b}).png")