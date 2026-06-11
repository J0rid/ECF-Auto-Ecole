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
        public IActionResult GetAll() => Ok(_eleveMetier.GetAll());

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            Eleve? eleve = _eleveMetier.GetById(id);
            if (eleve == null) return NotFound(new { message = $"Élève {id} introuvable." });
            return Ok(eleve);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Eleve eleve)
        {
            _eleveMetier.Create(eleve);
            return Created(string.Empty, eleve);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Eleve eleve)
        {
            eleve.IdEleve = id;
            if (!_eleveMetier.Update(eleve))
                return NotFound(new { message = $"Élève {id} introuvable." });
            return Ok(eleve);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!_eleveMetier.Delete(id))
                return NotFound(new { message = $"Élève {id} introuvable." });
            return NoContent();
        }
    }
}
