using System.ComponentModel.DataAnnotations;

namespace ECF_AEL.Models
{
    public class Eleve
    {
        public int IdEleve { get; set; }

        [Required]
        public string NomEleve { get; set; } = string.Empty;

        [Required]
        public string PrenomEleve { get; set; } = string.Empty;

        public bool Code { get; set; }
        public bool Conduite { get; set; }

        [Required]
        public DateOnly DateNaissance { get; set; }

        public DateOnly DateInscription { get; set; }
    }
}
