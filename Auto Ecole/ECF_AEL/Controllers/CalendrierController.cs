using ECF_AEL.Metier;
using ECF_AEL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECF_AEL.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CalendrierController : ControllerBase
    {
        private readonly ICalendrierMetier _calendrierMetier;

        public CalendrierController(ICalendrierMetier calendrierMetier)
        {
            _calendrierMetier = calendrierMetier;
        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_calendrierMetier.GetAll());

        [HttpPost]
        public IActionResult Create([FromBody] Calendrier calendrier)
        {
            (bool Success, string? Erreur) resultat = _calendrierMetier.Create(calendrier.DateHeure);
            if (!resultat.Success) return Conflict(new { message = resultat.Erreur });
            return Created(string.Empty, calendrier);
        }

        [HttpPost("batch")]
        public IActionResult CreateMany([FromBody] List<Calendrier> creneaux)
        {
            List<DateTime> dates = creneaux.Select(c => c.DateHeure).ToList();
            (bool Success, string? Erreur) resultat = _calendrierMetier.CreateMany(dates);
            if (!resultat.Success) return Conflict(new { message = resultat.Erreur });
            return Created(string.Empty, new { count = dates.Count });
        }

        [HttpDelete]
        public IActionResult Delete([FromQuery] DateTime dateHeure)
        {
            (bool Success, string? Erreur) resultat = _calendrierMetier.Delete(dateHeure);
            if (!resultat.Success)
            {
                if (resultat.Erreur!.Contains("n'existe pas")) return NotFound(new { message = resultat.Erreur });
                return Conflict(new { message = resultat.Erreur });
            }
            return NoContent();
        }
    }
}
