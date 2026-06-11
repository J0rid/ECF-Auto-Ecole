using System.ComponentModel.DataAnnotations;

namespace ECF_AEL.Models
{
    public class Epreuve
    {
        public int IdEpreuve { get; set; }

        [Range(1, int.MaxValue)]
        public int EleveIdEpreuve { get; set; }

        [Required]
        public string TypeEpreuve { get; set; } = string.Empty;

        [Required]
        public DateOnly DateEpreuve { get; set; }

        public bool Resultat { get; set; }
    }
}
