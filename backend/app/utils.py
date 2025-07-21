import random
from typing import List, Tuple, Union

from app.models import PDFPoint
from app.enums import SprtEvaluation


def evaluate_pdf(a: float, b: float, x: float) -> float:
    return x ** (a - 1) * (1 - x) ** (b - 1)


def get_unit_normalized_pdf(a: float, b: float, n_points: int = 100) -> List[PDFPoint]:
    """
    Returns a list of PDF values of beta distribution, normalized so the
    maximum value is 1.0.
    """
    xs = [x / n_points for x in range(n_points + 1)]
    ys = [evaluate_pdf(a, b, x) for x in xs]
    ymax = max(ys)
    return [PDFPoint(x=x, y=y/ymax) for x, y in zip(xs, ys)]


def get_mode(a: float, b: float) -> Union[float, None]:
    """
    Mode of beta distribution.
    """
    return (a - 1) / (a + b - 2)


def _sample_beta(a: float, b: float, n: int, seed: int = 42) -> List[float]:
    random.seed(seed)
    return [random.betavariate(a, b) for _ in range(n)]


def get_hdi(
    a: float, b: float, hdi_mass: float, n_samples=10**5
) -> Tuple[float, Tuple[float, float]]:
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
    min_interval_width = float("inf")
    min_interval_idx_lo = 0

    for idx in range(len(samples) - window_width):
        cur_interval_width = samples[idx + window_width] - samples[idx]
        if cur_interval_width < min_interval_width:
            min_interval_width = cur_interval_width
            min_interval_idx_lo = idx

    return min_interval_width, (
        samples[min_interval_idx_lo],
        samples[min_interval_idx_lo + window_width],
    )


def get_sprt(
        a: float, b: float, confidence: float, lo: float, hi: float, n_samples=10**5
) -> Tuple[float, SprtEvaluation]:
    """
    Simplified version of Bayesian sequantial probability ratio test, in which
    the rewards for correctly passing or failing are normalized to 1.0. This
    lets us work with the probability of passing requirements, instead of the
    usual likelihood ratio. The requirements are easier to elicit in this case,
    since they can be specified on the scale of the success rate, rather than
    being expressed in terms of odds.

    If the probability of meeting requirements exceeds `confidence`
    the result is "Pass". If the probability of meeting requirements is less
    than 1 - `confidence`, the result is "Fail". Otherwise, the result
    is "Continue the experiment".

    :param a: Parameter of beta distribution.

    :param b: Parameter of beta distribution.

    :param confidence: Number between 0 and 1 (exclusive).

    :param lo: Lower limit of the required range.

    :param hi: Upper limit of the required range.

    :param n_samples: Number of samples used to approximate the probability of
    meeting the requirement.

    :return: (probability of meeting requirement, evaluation of success rate)
    """
    samples = _sample_beta(a, b, n_samples)
    prob_requirement_met = sum(map(lambda p: lo < p < hi, samples)) / n_samples
    if prob_requirement_met > confidence:
        sprt_eval = SprtEvaluation.PASS
    elif prob_requirement_met < 1 - confidence:
        sprt_eval = SprtEvaluation.FAIL
    else:
        sprt_eval = SprtEvaluation.CONTINUE
    return (prob_requirement_met, sprt_eval)
