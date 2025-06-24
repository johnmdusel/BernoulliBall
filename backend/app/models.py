from pydantic import BaseModel
from typing import List


class PDFPoint(BaseModel):
    x: float
    y: float


class EstimateResponse(BaseModel):
    a: int
    b: int
    hdi_mass: float
    pdf: List[PDFPoint]
    hdi_lower: float
    hdi_upper: float
    mode: float
