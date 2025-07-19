from enum import Enum


class SprtEvaluation(Enum):
    """
    Indicates whether a requirement is met (PASS) or not met (FAIL),
    or whether further testing is necessary (CONTINUE).
    """
    PASS = "Pass"
    FAIL = "Fail"
    CONTINUE = "Continue"


class OperatingMode(Enum):
    """
    Operating mode of the app.

    Estimate: HDI and mode of beta distribution.

     Evaluate: Probability requirement is met and pass/fail/continue decision.
    """
    ESTIMATE = "Estimate"
    EVALUATE = "Evaluate"
