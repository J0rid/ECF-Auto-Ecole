namespace ECF_AEL.Models
{
    public class StatsEchecMultiple
    {
        public int IdEleve { get; set; }
        public string NomEleve { get; set; } = string.Empty;
        public string PrenomEleve { get; set; } = string.Empty;
        public int NbEchecCode { get; set; }
        public int NbEchecConduite { get; set; }
        public int TotalEchecs => NbEchecCode + NbEchecConduite;
    }
}
