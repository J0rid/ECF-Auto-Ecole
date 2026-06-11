using ECF_AEL.Metier;
using ECF_AEL.Models;
using Microsoft.AspNetCore.Mvc;

namespace ECF_AEL.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthMetier _authMetier;

        public AuthController(IAuthMetier authMetier)
        {
            _authMetier = authMetier;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            LoginResponse? response = _authMetier.Login(request);
            if (response == null)
                return Unauthorized(new { message = "Identifiants invalides." });

            return Ok(response);
        }
    }
}
