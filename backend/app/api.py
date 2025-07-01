from fastapi import APIRouter, HTTPException, Query
from .models import EstimateResponse

from .utils import evaluate_pdf, get_unnormalized_pdf, get_mode, get_hdi

router = APIRouter()


@router.get("/estimate", response_model=EstimateResponse)
def get_estimate(
    a: float = Query(ge=0, description="Number of successes. Must be > 0"),
    b: float = Query(ge=0, description="Number of failures. Must be > 0"),
    hdi_mass: float = Query(gt=0.0, lt=1.0, description="Confidence level. Must be between 0 and 1 (exclusive)")
) -> EstimateResponse:
    # The Query(...) parameters provide automatic validation for the API docs and request parsing.
    # Additional check (optional, for custom error messages):
    if a < 0:
        raise HTTPException(status_code=422, detail="Number of successes must be >= 0.")
    if b < 0:
        raise HTTPException(status_code=422, detail="Number of failures must be >= 0.")
    if not (0 < hdi_mass < 1):
        raise HTTPException(status_code=422, detail="Confidence level must be between 0 and 1 (exclusive).")

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