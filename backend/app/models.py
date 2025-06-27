from pydantic import BaseModel
from typing import List


class PDFPoint(BaseModel):
    x: float
    y: float


class EstimateResponse(BaseModel):
    a: float
    b: float
    hdi_mass: float
    pdf: List[PDFPoint]
    hdi_lower_x: float
    hdi_lower_y: float
    hdi_upper_x: float
    hdi_upper_y: float
    mode: float
