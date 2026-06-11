namespace ECF_AEL.Models
{
    public class LeconDetail
    {
        public string ModeleLecon { get; set; } = string.Empty;
        public DateTime DateHLecon { get; set; }
        public int EleveId { get; set; }
        public string NomEleve { get; set; } = string.Empty;
        public string PrenomEleve { get; set; } = string.Empty;
        public int MoniteurId { get; set; }
        public string NomMoniteur { get; set; } = string.Empty;
        public string PrenomMoniteur { get; set; } = string.Empty;
        public int Duree { get; set; }
    }
}
