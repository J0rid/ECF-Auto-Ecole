using ECF_AEL.Metier;
using ECF_AEL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECF_AEL.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VehiculeController : ControllerBase
    {
        private readonly IVehiculeMetier _vehiculeMetier;

        public VehiculeController(IVehiculeMetier vehiculeMetier)
        {
            _vehiculeMetier = vehiculeMetier;
        }

        [HttpGet]
        public IActionResult GetAllVehicules() => Ok(_vehiculeMetier.GetAllVehicules());

        [HttpGet("{noImmat}")]
        public IActionResult GetVehiculeByImmat(string noImmat)
        {
            VehiculeDetail? vehicule = _vehiculeMetier.GetVehiculeByImmat(noImmat);
            if (vehicule == null) return NotFound(new { message = $"Véhicule '{noImmat}' introuvable." });
            return Ok(vehicule);
        }

        [HttpPost]
        public IActionResult CreateVehicule([FromBody] Vehicule vehicule)
        {
            _vehiculeMetier.CreateVehicule(vehicule);
            return Created(string.Empty, vehicule);
        }

        [HttpPut("{noImmat}")]
        public IActionResult UpdateVehicule(string noImmat, [FromBody] Vehicule vehicule)
        {
            vehicule.NoImmat = noImmat;
            if (!_vehiculeMetier.UpdateVehicule(vehicule))
                return NotFound(new { message = $"Véhicule '{noImmat}' introuvable." });
            return Ok(vehicule);
        }

        [HttpPatch("{noImmat}/activer")]
        public IActionResult ActiverVehicule(string noImmat)
        {
            if (!_vehiculeMetier.ActiverVehicule(noImmat))
                return NotFound(new { message = $"Véhicule '{noImmat}' introuvable." });
            return Ok(new { message = "Véhicule activé." });
        }

        [HttpPatch("{noImmat}/desactiver")]
        public IActionResult DesactiverVehicule(string noImmat)
        {
            if (!_vehiculeMetier.DesactiverVehicule(noImmat))
                return NotFound(new { message = $"Véhicule '{noImmat}' introuvable." });
            return Ok(new { message = "Véhicule désactivé." });
        }

        [HttpDelete("{noImmat}")]
        public IActionResult DeleteVehicule(string noImmat)
        {
            if (!_vehiculeMetier.DeleteVehicule(noImmat))
                return NotFound(new { message = $"Véhicule '{noImmat}' introuvable." });
            return NoContent();
        }
    }
}
