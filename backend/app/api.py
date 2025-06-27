from fastapi import APIRouter
from .models import EstimateResponse, PDFPoint

from typing import List, Union

router = APIRouter()


@router.get("/estimate", response_model=EstimateResponse)
def get_estimate(a: float = 3, b: float = 5, hdi_mass: float = 0.95) -> EstimateResponse:
    return EstimateResponse(
        a=a,
        b=b,
        hdi_mass=hdi_mass,
        pdf=get_pdf(a, b),
        hdi_lower_x=0.23,
        hdi_lower_y=evaluate_pdf(a, b, 0.23),
        hdi_upper_x=0.70,
        hdi_upper_y=evaluate_pdf(a, b, 0.70),
        mode=get_mode(a, b)
    )

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
