import random
from typing import List, Tuple, Union

from app.models import PDFPoint


def evaluate_pdf(a: float, b: float, x: float) -> float:
    return x**(a - 1) * (1 - x)**(b - 1)


def get_unnormalized_pdf(a: float, b: float, n_points: int = 100) -> List[PDFPoint]:
    """
    Returns a list of *unnormalized* PDF values of beta distribution.
    """
    xs = [x / n_points for x in range(n_points + 1)]
    ys = [evaluate_pdf(a, b, x) for x in xs]
    return [PDFPoint(x=x, y=y) for x, y in zip(xs, ys)]


def get_mode(a: float, b: float) -> Union[float, None]:
    """
    Mode of beta distribution.
    """
    return (a - 1) / (a + b - 2)


def get_hdi(a: float, b: float, hdi_mass: float, n_samples=10**5) -> Tuple[float, Tuple[float, float]]:
    """
    Estimated highest density interval from a beta distribution.

    :param a: Parameter
    :param b: Parameter
    :param hdi_mass: Confidence level from UI
    :param n_samples: Number of samples used for estimation
    :return: Estimated width, (lower_limit, upper_limit) of highest density interval
    """
    samples = sorted(_sample_beta(a, b, n_samples))
    window_width = int(hdi_mass * len(samples))
    min_interval_width = float('inf')
    min_interval_idx_lo = 0

    for idx in range(len(samples) - window_width):
        cur_interval_width = samples[idx + window_width] - samples[idx]
        if cur_interval_width < min_interval_width:
            min_interval_width = cur_interval_width
            min_interval_idx_lo = idx

    return min_interval_width, (samples[min_interval_idx_lo],
                                samples[min_interval_idx_lo + window_width])


def _sample_beta(a: float, b: float, n: int, seed: int = 42) -> List[float]:
    random.seed(seed)
    return [random.betavariate(a, b) for _ in range(n)]
