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
        public IActionResult GetAllLecons() => Ok(_leconMetier.GetAllLecons());

        [HttpGet("eleve/{eleveId}")]
        public IActionResult GetLeconsByEleve(int eleveId) => Ok(_leconMetier.GetLeconsByEleve(eleveId));

        [HttpPost]
        public IActionResult ReserverLecon([FromBody] Lecon lecon)
        {
            ReservationResult result = _leconMetier.ReserverLecon(lecon);
            if (!result.Success)
                return Conflict(new { message = result.Erreur });
            return Created(string.Empty, lecon);
        }

        [HttpDelete]
        public IActionResult AnnulerLecon([FromBody] Lecon lecon)
        {
            bool annule = _leconMetier.AnnulerLecon(lecon.ModeleLecon, lecon.DateHLecon, lecon.EleveId, lecon.MoniteurId);
            if (!annule)
                return NotFound(new { message = "Leçon introuvable." });
            return NoContent();
        }
    }
}
