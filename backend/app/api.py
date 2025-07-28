from fastapi import APIRouter

from .models import EstimateResponse, EvaluateResponse
from .utils import get_unit_normalized_pdf, get_mode, get_hdi, get_sprt

router = APIRouter()


@router.get("/estimate", response_model=EstimateResponse)
def get_estimate(a: float, b: float, hdi_mass: float) -> EstimateResponse:
    if a == 1 and b == 1:
        hdi_lo, hdi_hi = None, None
        mode = None
    else:
        _, hdi_endpts = get_hdi(a, b, hdi_mass)
        hdi_lo, hdi_hi = [round(endpt, 2) for endpt in hdi_endpts]
        mode = round(get_mode(a, b), 2)

    return EstimateResponse(
        pdf=get_unit_normalized_pdf(a, b),
        hdi_lower_x=hdi_lo,
        hdi_upper_x=hdi_hi,
        mode=mode,
    )

@router.get("/evaluate", response_model=EvaluateResponse)
def get_evaluate(
    a: float, b: float, confidence: float, lo: float, hi: float
) -> EvaluateResponse:
    prob, sprt_eval = get_sprt(a, b, confidence, lo, hi)
    return EvaluateResponse(
        pdf=get_unit_normalized_pdf(a, b),
        prob_requirement_met=prob,
        evaluation=sprt_eval.value
    )
