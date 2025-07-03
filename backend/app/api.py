from fastapi import APIRouter

from .models import EstimateResponse
from .utils import get_unnormalized_pdf, get_mode, get_hdi

router = APIRouter()


@router.get("/estimate", response_model=EstimateResponse)
def get_estimate(a: float, b: float, hdi_mass: float) -> EstimateResponse:
    if a == 1 and b == 1:
        hdi_lo, hdi_hi = None, None
        mode = None
    else:
        _, (hdi_lo, hdi_hi) = get_hdi(a, b, hdi_mass)
        mode = get_mode(a, b)

    return EstimateResponse(
        a=a,
        b=b,
        hdi_mass=hdi_mass,
        pdf=get_unnormalized_pdf(a, b),
        hdi_lower_x=hdi_lo,
        hdi_upper_x=hdi_hi,
        mode=mode,
    )
