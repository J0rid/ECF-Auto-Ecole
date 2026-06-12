using ECF_AEL.Metier;
using ECF_AEL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECF_AEL.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EleveController : ControllerBase
    {
        private readonly IEleveMetier _eleveMetier;

        public EleveController(IEleveMetier eleveMetier)
        {
            _eleveMetier = eleveMetier;
        }

        [HttpGet]
        public IActionResult GetAllEleves() => Ok(_eleveMetier.GetAllEleves());

        [HttpGet("{id}")]
        public IActionResult GetEleveById(int id)
        {
            Eleve? eleve = _eleveMetier.GetEleveById(id);
            if (eleve == null) return NotFound(new { message = $"Élève {id} introuvable." });
            return Ok(eleve);
        }

        [HttpPost]
        public IActionResult CreateEleve([FromBody] Eleve eleve)
        {
            _eleveMetier.CreateEleve(eleve);
            return Created(string.Empty, eleve);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateEleve(int id, [FromBody] Eleve eleve)
        {
            eleve.IdEleve = id;
            if (!_eleveMetier.UpdateEleve(eleve))
                return NotFound(new { message = $"Élève {id} introuvable." });
            return Ok(eleve);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEleve(int id)
        {
            if (!_eleveMetier.DeleteEleve(id))
                return NotFound(new { message = $"Élève {id} introuvable." });
            return NoContent();
        }
    }
}
