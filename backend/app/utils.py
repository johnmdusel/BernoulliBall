import heapq
from random import random
from typing import List, Tuple, Union

from app.models import PDFPoint


def evaluate_pdf(a: float, b: float, x: float) -> float:
    return x**(a - 1) * (1 - x)**(b - 1)


def get_pdf(a: float, b: float, n_points: int = 100) -> List[PDFPoint]:
    """
    Return list of *unnormalized* PDF values of beta distribution.

    :param a:
    :param b:
    :param n_points:
    :return:
    """
    xs = [x / n_points for x in range(n_points + 1)]
    ys = [evaluate_pdf(a, b, x) for x in xs]
    return [PDFPoint(x=x, y=y) for x, y in zip(xs, ys)]


def get_mode(a: float, b: float) -> Union[float, None]:
    if a < 1 or b < 1:
        return None  # TODO check if handled correctly
    return (a - 1) / (a + b - 2)


def get_hdi(a: float, b: float, hdi_mass: float) -> Tuple[float, Tuple[float, float]]:
    """
    Endpoints of the highest density interval from a beta distribution.

    :param a: Parameter
    :param b: Parameter
    :param hdi_mass: Confidence level from UI
    :return: width, (lower_limit, upper_limit) of highest density interval
    """
    samples = _sample_beta(a, b, n=10**3, _n=10**3)
    samples = sorted(samples)
    idx_lo = 0
    idx_hi = int(hdi_mass * len(samples))
    endpoints = []
    heapq.heapify(endpoints)
    while idx_hi < len(samples):
        heapq.heappush(
            endpoints,
        (
                samples[idx_hi] - samples[idx_lo],  # width
                (samples[idx_lo], samples[idx_hi])  # (lower_limit, upper_limit)
            )
        )
        idx_lo += 1
        idx_hi += 1
    return endpoints[0]

def _sample_beta(a: float, b: float, n: int, _n: int) -> List[float]:
    """

    :param a: Parameter
    :param b: Parameter
    :param n: Number of samples to return
    :param _n: Number of Bernoulli trials per sample
    :return: List of `n` samples from Beta distribution
    """
    return [
        sum(random() < a / (a + b) for _ in range(_n)) / _n
        for _ in range(n)
    ]
