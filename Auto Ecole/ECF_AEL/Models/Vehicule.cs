using System.ComponentModel.DataAnnotations;

namespace ECF_AEL.Models
{
    public class Vehicule
    {
        [Required]
        public string NoImmat { get; set; } = string.Empty;

        [Required]
        public string ModeleVehicule { get; set; } = string.Empty;

        public bool Etat { get; set; }
    }
}
