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
        public IActionResult GetAllEpreuves() => Ok(_epreuveMetier.GetAllEpreuves());

        [HttpGet("eleve/{eleveId}")]
        public IActionResult GetEpreuvesByEleve(int eleveId) => Ok(_epreuveMetier.GetEpreuvesByEleve(eleveId));

        [HttpPost]
        public IActionResult CreateEpreuve([FromBody] Epreuve epreuve)
        {
            (bool Success, string? Erreur) resultat = _epreuveMetier.CreateEpreuve(epreuve);
            if (!resultat.Success)
            {
                if (resultat.Erreur!.Contains("introuvable")) return NotFound(new { message = resultat.Erreur });
                return BadRequest(new { message = resultat.Erreur });
            }
            return Created(string.Empty, epreuve);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEpreuve(int id)
        {
            if (!_epreuveMetier.DeleteEpreuve(id))
                return NotFound(new { message = $"Épreuve {id} introuvable." });
            return NoContent();
        }
    }
}
