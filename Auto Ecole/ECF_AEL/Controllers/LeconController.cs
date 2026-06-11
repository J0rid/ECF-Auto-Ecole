using ECF_AEL.Metier;
using ECF_AEL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECF_AEL.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LeconController : ControllerBase
    {
        private readonly ILeconMetier _leconMetier;

        public LeconController(ILeconMetier leconMetier)
        {
            _leconMetier = leconMetier;
        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_leconMetier.GetAll());

        [HttpGet("eleve/{eleveId}")]
        public IActionResult GetByEleve(int eleveId) => Ok(_leconMetier.GetByEleve(eleveId));

        [HttpPost]
        public IActionResult Reserver([FromBody] Lecon lecon)
        {
            ReservationResult result = _leconMetier.Reserver(lecon);
            if (!result.Success)
                return Conflict(new { message = result.Erreur });
            return Created(string.Empty, lecon);
        }

        [HttpDelete]
        public IActionResult Annuler([FromBody] Lecon lecon)
        {
            bool annule = _leconMetier.Annuler(lecon.ModeleLecon, lecon.DateHLecon, lecon.EleveId, lecon.MoniteurId);
            if (!annule)
                return NotFound(new { message = "Leçon introuvable." });
            return NoContent();
        }
    }
}
