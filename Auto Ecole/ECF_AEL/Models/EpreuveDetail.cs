namespace ECF_AEL.Models
{
    public class EpreuveDetail
    {
        public int IdEpreuve { get; set; }
        public int EleveIdEpreuve { get; set; }
        public string NomEleve { get; set; } = string.Empty;
        public string PrenomEleve { get; set; } = string.Empty;
        public string TypeEpreuve { get; set; } = string.Empty;
        public DateOnly DateEpreuve { get; set; }
        public bool Resultat { get; set; }
    }
}
