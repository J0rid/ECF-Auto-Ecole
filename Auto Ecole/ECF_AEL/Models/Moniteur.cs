using System.ComponentModel.DataAnnotations;

namespace ECF_AEL.Models
{
    public class Moniteur
    {
        public int IdMoniteur { get; set; }

        [Required]
        public string NomMoniteur { get; set; } = string.Empty;

        [Required]
        public string PrenomMoniteur { get; set; } = string.Empty;

        [Required]
        public DateOnly DateNaissance { get; set; }

        [Required]
        public DateOnly DateEmbauche { get; set; }

        public bool Activite { get; set; }
    }
}
