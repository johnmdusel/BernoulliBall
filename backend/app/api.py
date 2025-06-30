from fastapi import APIRouter
from .models import EstimateResponse

from .utils import evaluate_pdf, get_unnormalized_pdf, get_mode, get_hdi

router = APIRouter()


@router.get("/estimate", response_model=EstimateResponse)
def get_estimate(a: float = 3, b: float = 5, hdi_mass: float = 0.95) -> EstimateResponse:
    _, (hdi_lo, hdi_hi) = get_hdi(a, b, hdi_mass)
    return EstimateResponse(
        a=a,
        b=b,
        hdi_mass=hdi_mass,
        pdf=get_unnormalized_pdf(a, b),
        hdi_lower_x=hdi_lo,
        hdi_lower_y=evaluate_pdf(a, b, hdi_lo),
        hdi_upper_x=hdi_hi,
        hdi_upper_y=evaluate_pdf(a, b, hdi_hi),
        mode=get_mode(a, b)
    )


