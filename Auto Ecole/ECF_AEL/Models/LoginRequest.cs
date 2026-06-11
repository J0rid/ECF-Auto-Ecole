using System.ComponentModel.DataAnnotations;

namespace ECF_AEL.Models
{
    public class LoginRequest
    {
        [Required]
        public string Login { get; set; } = string.Empty;

        [Required]
        public string MotDePasse { get; set; } = string.Empty;
    }
}
