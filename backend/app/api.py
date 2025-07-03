from fastapi import APIRouter, Query

from .models import EstimateResponse
from .utils import get_unnormalized_pdf, get_mode, get_hdi

router = APIRouter()


@router.get("/estimate", response_model=EstimateResponse)
def get_estimate(
    a: float = Query(ge=0, description="Number of successes. Must be > 0"),
    b: float = Query(ge=0, description="Number of failures. Must be > 0"),
    hdi_mass: float = Query(
        gt=0.0,
        lt=1.0,
        description="Confidence level. Must be between 0 and 1 (exclusive)",
    ),
) -> EstimateResponse:
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
