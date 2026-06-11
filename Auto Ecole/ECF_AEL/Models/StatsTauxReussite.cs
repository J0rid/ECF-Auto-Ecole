namespace ECF_AEL.Models
{
    public class StatsTauxReussite
    {
        public int Annee { get; set; }
        public StatsTypeEpreuve Code { get; set; } = new();
        public StatsTypeEpreuve Conduite { get; set; } = new();
    }
}
