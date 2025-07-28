from fastapi import APIRouter, Query#, Depends

from .models import EstimateResponse, EvaluateResponse#, RequirementParameters
from .utils import get_unit_normalized_pdf, get_mode, get_hdi, get_sprt

router = APIRouter()


@router.get("/estimate", response_model=EstimateResponse)
def get_estimate(
    a: float = Query(..., gt=0, description="Parameter of beta distribution"),
    b: float = Query(..., gt=0, description="Parameter of beta distribution"), 
    hdi_mass: float = Query(
        ..., 
        gt=0, 
        lt=1, 
        description="Proportion of mass in posterior highest density interval"
    )
) -> EstimateResponse:
    if a == 1 and b == 1:
        hdi_lo, hdi_hi, mode = None, None, None
    else:
        _, (hdi_lo, hdi_hi) = get_hdi(a, b, hdi_mass)
        mode = get_mode(a, b)

    return EstimateResponse(
        pdf=get_unit_normalized_pdf(a, b),
        hdi_lower_x=hdi_lo,
        hdi_upper_x=hdi_hi,
        mode=mode,
    )

@router.get("/evaluate", response_model=EvaluateResponse)
def get_evaluate(
    a: float = Query(..., gt=0, description="Parameter of beta distribution"), 
    b: float = Query(..., gt=0, description="Parameter of beta distribution"), 
    confidence: float = Query(
        ..., 
        gt=0,
        lt=1,
        description="Confidence level of evaluation "
    ), 
    # see TODO in models.py
    # requirement: RequirementParameters = Depends()
    lo: float = Query(
        ..., 
        ge=0, 
        lt=1, 
        description="Lower limit of required range"
     ), 
    hi: float = Query(
        ..., 
        gt=0,
        le=1,
        description="Upper limit of required range"
    )
) -> EvaluateResponse:
    # prob, sprt_eval = get_sprt(a, b, confidence, requirement.lo, requirement.hi)
    prob, sprt_eval = get_sprt(a, b, confidence, lo, hi)
    return EvaluateResponse(
        pdf=get_unit_normalized_pdf(a, b),
        prob_requirement_met=prob,
        evaluation=sprt_eval.value
    )
