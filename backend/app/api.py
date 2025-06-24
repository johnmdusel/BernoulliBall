from fastapi import APIRouter
from .models import EstimateResponse, PDFPoint

router = APIRouter()


@router.get("/estimate", response_model=EstimateResponse)
def get_estimate(a: int = 3, b: int = 5, hdi_mass: float = 0.95):
    # Dummy PDF data for now
    pdf = [PDFPoint(x=0.00, y=0.02), PDFPoint(x=0.01, y=0.04)]
    return EstimateResponse(
        a=a, b=b, hdi_mass=hdi_mass, pdf=pdf, hdi_lower=0.23, hdi_upper=0.70, mode=0.55
    )
