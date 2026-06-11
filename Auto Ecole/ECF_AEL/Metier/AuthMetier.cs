using ECF_AEL.Models;
using ECF_AEL.Repository;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ECF_AEL.Metier
{
    public class AuthMetier : IAuthMetier
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthMetier(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public LoginResponse? Login(LoginRequest request)
        {
            User? user = _userRepository.GetUserByLogin(request.Login);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.MotDePasse, user.MotDePasse))
                return null;

            return new LoginResponse
            {
                Token = GenerateToken(user),
                NomRole = user.NomRole
            };
        }

        private string GenerateToken(User user)
        {
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            SigningCredentials credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            Claim[] claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.IdUser.ToString()),
                new Claim(ClaimTypes.Name, user.Login),
                new Claim(ClaimTypes.Role, user.NomRole)
            };

            JwtSecurityToken token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
