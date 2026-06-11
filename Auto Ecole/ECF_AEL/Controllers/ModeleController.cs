using ECF_AEL.Metier;
using ECF_AEL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECF_AEL.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ModeleController : ControllerBase
    {
        private readonly IModeleMetier _modeleMetier;

        public ModeleController(IModeleMetier modeleMetier)
        {
            _modeleMetier = modeleMetier;
        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_modeleMetier.GetAll());

        [HttpPost]
        public IActionResult Create([FromBody] Modele modele)
        {
            _modeleMetier.Create(modele);
            return Created(string.Empty, modele);
        }

        [HttpDelete("{modeleVehicule}")]
        public IActionResult Delete(string modeleVehicule)
        {
            if (!_modeleMetier.Delete(modeleVehicule))
                return NotFound(new { message = $"Modèle '{modeleVehicule}' introuvable." });
            return NoContent();
        }
    }
}
