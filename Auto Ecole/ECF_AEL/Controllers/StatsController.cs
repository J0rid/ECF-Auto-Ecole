using ECF_AEL.Metier;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECF_AEL.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StatsController : ControllerBase
    {
        private readonly IStatsMetier _statsMetier;

        public StatsController(IStatsMetier statsMetier)
        {
            _statsMetier = statsMetier;
        }

        [HttpGet("taux-reussite")]
        public IActionResult GetTauxReussite()
            => Ok(_statsMetier.GetTauxReussiteAnneeCourante());

        [HttpGet("echecs-multiples")]
        public IActionResult GetEchecsMultiples([FromQuery] int seuil = 2)
        {
            if (seuil < 1) return BadRequest(new { message = "Le seuil doit être supérieur ou égal à 1." });
            return Ok(_statsMetier.GetElevesEchecMultiple(seuil));
        }
    }
}
