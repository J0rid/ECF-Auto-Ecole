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
        public IActionResult GetAll() => Ok(_vehiculeMetier.GetAll());

        [HttpGet("{noImmat}")]
        public IActionResult GetByImmat(string noImmat)
        {
            VehiculeDetail? vehicule = _vehiculeMetier.GetByImmat(noImmat);
            if (vehicule == null) return NotFound(new { message = $"Véhicule '{noImmat}' introuvable." });
            return Ok(vehicule);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Vehicule vehicule)
        {
            _vehiculeMetier.Create(vehicule);
            return Created(string.Empty, vehicule);
        }

        [HttpPut("{noImmat}")]
        public IActionResult Update(string noImmat, [FromBody] Vehicule vehicule)
        {
            vehicule.NoImmat = noImmat;
            if (!_vehiculeMetier.Update(vehicule))
                return NotFound(new { message = $"Véhicule '{noImmat}' introuvable." });
            return Ok(vehicule);
        }

        [HttpPatch("{noImmat}/activer")]
        public IActionResult Activer(string noImmat)
        {
            if (!_vehiculeMetier.Activer(noImmat))
                return NotFound(new { message = $"Véhicule '{noImmat}' introuvable." });
            return Ok(new { message = "Véhicule activé." });
        }

        [HttpPatch("{noImmat}/desactiver")]
        public IActionResult Desactiver(string noImmat)
        {
            if (!_vehiculeMetier.Desactiver(noImmat))
                return NotFound(new { message = $"Véhicule '{noImmat}' introuvable." });
            return Ok(new { message = "Véhicule désactivé." });
        }

        [HttpDelete("{noImmat}")]
        public IActionResult Delete(string noImmat)
        {
            if (!_vehiculeMetier.Delete(noImmat))
                return NotFound(new { message = $"Véhicule '{noImmat}' introuvable." });
            return NoContent();
        }
    }
}
