from decimal import Decimal
from typing import Optional, List

from pydantic import BaseModel, Field, root_validator


class PDFPoint(BaseModel):
    x: float
    y: float

class BaseResponse(BaseModel):
    pdf: List[PDFPoint]

class EstimateResponse(BaseResponse):
    hdi_lower_x: Optional[Decimal] = Field(
        default=None,
        ge=0, 
        le=1, 
        decimal_places=2,
        description="Lower bound of HDI, or `None` if HDI is undefined"
    )
    hdi_upper_x: Optional[Decimal] = Field(
        default=None,
        ge=0, 
        le=1, 
        decimal_places=2,
        description="Upper bound of HDI, or `None` if HDI is undefined"
    )
    mode: Optional[Decimal] = Field(
        default=None,
        ge=0, 
        le=1, 
        decimal_places=2,
        description="Mode of beta distribution, or `None` if no mode exists"
    )

    @root_validator(pre=True)
    def round_values(cls, values):
        for key in ("hdi_lower_x", "hdi_upper_x", "mode"):
            if key in values and values[key] is not None:
                values[key] = round(values[key], 2)
        return values

# TODO support multi-field constraints
# class RequirementParameters(BaseModel):
#     lo: float = Field(
#         ge=0,
#         lt=1,
#         description="Lower limit of required range"
#     )
#     hi: float = Field(
#         gt=0, 
#         le=1,
#         description="Upper limit of required range"
#     )

#     @root_validator(pre=True)
#     def check_requirement_limits(cls, values):
#         lo = values.get("lo")
#         hi = values.get("hi")
#         if lo is not None and hi is not None and hi <= lo:
#             raise ValueError(f"`lo` must be < `hi`; got lo={lo}, hi={hi}")

class EvaluateResponse(BaseResponse):
    prob_requirement_met: float = Field(
        ge=0, 
        le=1,
        description="Probability that success rate meets requirements"
    )
    evaluation: str = Field(
        description="Evaluation of estimated success rate against requirements"
    )
