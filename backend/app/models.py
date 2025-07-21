from pydantic import BaseModel
from typing import List, Optional


class PDFPoint(BaseModel):
    x: float
    y: float

class BaseResponse(BaseModel):
    a: float
    b: float
    pdf: List[PDFPoint]

class EstimateResponse(BaseResponse):
    hdi_mass: float
    hdi_lower_x: Optional[float]
    hdi_upper_x: Optional[float]
    mode: Optional[float]

class EvaluateResponse(BaseResponse):
    confidence: float
    prob_requirement_met: float
    evaluation: str
