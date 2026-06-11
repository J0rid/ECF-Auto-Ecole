namespace ECF_AEL.Models
{
    public class User
    {
        public int IdUser { get; set; }
        public string NomUser { get; set; } = string.Empty;
        public string PrenomUser { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string MotDePasse { get; set; } = string.Empty;
        public int IdRole { get; set; }
        public string NomRole { get; set; } = string.Empty;
    }
}
