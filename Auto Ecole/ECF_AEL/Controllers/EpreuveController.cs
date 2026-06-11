using ECF_AEL.Metier;
using ECF_AEL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECF_AEL.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EpreuveController : ControllerBase
    {
        private readonly IEpreuveMetier _epreuveMetier;

        public EpreuveController(IEpreuveMetier epreuveMetier)
        {
            _epreuveMetier = epreuveMetier;
        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_epreuveMetier.GetAll());

        [HttpGet("eleve/{eleveId}")]
        public IActionResult GetByEleve(int eleveId) => Ok(_epreuveMetier.GetByEleve(eleveId));

        [HttpPost]
        public IActionResult Create([FromBody] Epreuve epreuve)
        {
            (bool Success, string? Erreur) resultat = _epreuveMetier.Create(epreuve);
            if (!resultat.Success)
            {
                if (resultat.Erreur!.Contains("introuvable")) return NotFound(new { message = resultat.Erreur });
                return BadRequest(new { message = resultat.Erreur });
            }
            return Created(string.Empty, epreuve);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!_epreuveMetier.Delete(id))
                return NotFound(new { message = $"Épreuve {id} introuvable." });
            return NoContent();
        }
    }
}
