using System.ComponentModel.DataAnnotations;

namespace ECF_AEL.Models
{
    public class Lecon
    {
        [Required]
        public string ModeleLecon { get; set; } = string.Empty;

        [Required]
        public DateTime DateHLecon { get; set; }

        [Range(1, int.MaxValue)]
        public int EleveId { get; set; }

        [Range(1, int.MaxValue)]
        public int MoniteurId { get; set; }

        [Range(1, 240)]
        public int Duree { get; set; }
    }
}
