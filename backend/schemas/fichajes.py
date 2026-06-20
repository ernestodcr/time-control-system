from pydantic import BaseModel
from typing import Literal

class FichajeRequest(BaseModel):
    empleado_id: int
    tipo: Literal["entrada","salida"]