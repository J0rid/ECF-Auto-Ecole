using System.ComponentModel.DataAnnotations;

namespace ECF_AEL.Models
{
    public class Modele
    {
        [Required]
        public string ModeleVehicule { get; set; } = string.Empty;

        [Required]
        public string Marque { get; set; } = string.Empty;

        [Required]
        public string Annee { get; set; } = string.Empty;

        [Required]
        public DateOnly DateAchat { get; set; }
    }
}
