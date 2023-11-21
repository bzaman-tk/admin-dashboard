

const Heading = ({ title, description }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground pb-3 pt-2">{description}</p>
        </div>
    );
}

export default Heading;