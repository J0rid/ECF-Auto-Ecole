using ECF_AEL.Metier;
using ECF_AEL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECF_AEL.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MoniteurController : ControllerBase
    {
        private readonly IMoniteurMetier _moniteurMetier;

        public MoniteurController(IMoniteurMetier moniteurMetier)
        {
            _moniteurMetier = moniteurMetier;
        }

        [HttpGet]
        public IActionResult GetAllMoniteurs() => Ok(_moniteurMetier.GetAllMoniteurs());

        [HttpGet("{id}")]
        public IActionResult GetMoniteurById(int id)
        {
            Moniteur? moniteur = _moniteurMetier.GetMoniteurById(id);
            if (moniteur == null) return NotFound(new { message = $"Moniteur {id} introuvable." });
            return Ok(moniteur);
        }

        [HttpPost]
        public IActionResult CreateMoniteur([FromBody] Moniteur moniteur)
        {
            _moniteurMetier.CreateMoniteur(moniteur);
            return Created(string.Empty, moniteur);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateMoniteur(int id, [FromBody] Moniteur moniteur)
        {
            moniteur.IdMoniteur = id;
            if (!_moniteurMetier.UpdateMoniteur(moniteur))
                return NotFound(new { message = $"Moniteur {id} introuvable." });
            return Ok(moniteur);
        }

        [HttpPatch("{id}/activer")]
        public IActionResult ActiverMoniteur(int id)
        {
            if (!_moniteurMetier.ActiverMoniteur(id))
                return NotFound(new { message = $"Moniteur {id} introuvable." });
            return Ok(new { message = "Moniteur activé." });
        }

        [HttpPatch("{id}/desactiver")]
        public IActionResult DesactiverMoniteur(int id)
        {
            if (!_moniteurMetier.DesactiverMoniteur(id))
                return NotFound(new { message = $"Moniteur {id} introuvable." });
            return Ok(new { message = "Moniteur désactivé." });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMoniteur(int id)
        {
            if (!_moniteurMetier.DeleteMoniteur(id))
                return NotFound(new { message = $"Moniteur {id} introuvable." });
            return NoContent();
        }
    }
}
