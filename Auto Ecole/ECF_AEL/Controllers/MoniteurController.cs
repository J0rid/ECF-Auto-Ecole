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
        public IActionResult GetAll() => Ok(_moniteurMetier.GetAll());

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            Moniteur? moniteur = _moniteurMetier.GetById(id);
            if (moniteur == null) return NotFound(new { message = $"Moniteur {id} introuvable." });
            return Ok(moniteur);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Moniteur moniteur)
        {
            _moniteurMetier.Create(moniteur);
            return Created(string.Empty, moniteur);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Moniteur moniteur)
        {
            moniteur.IdMoniteur = id;
            if (!_moniteurMetier.Update(moniteur))
                return NotFound(new { message = $"Moniteur {id} introuvable." });
            return Ok(moniteur);
        }

        [HttpPatch("{id}/activer")]
        public IActionResult Activer(int id)
        {
            if (!_moniteurMetier.Activer(id))
                return NotFound(new { message = $"Moniteur {id} introuvable." });
            return Ok(new { message = "Moniteur activé." });
        }

        [HttpPatch("{id}/desactiver")]
        public IActionResult Desactiver(int id)
        {
            if (!_moniteurMetier.Desactiver(id))
                return NotFound(new { message = $"Moniteur {id} introuvable." });
            return Ok(new { message = "Moniteur désactivé." });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!_moniteurMetier.Delete(id))
                return NotFound(new { message = $"Moniteur {id} introuvable." });
            return NoContent();
        }
    }
}
