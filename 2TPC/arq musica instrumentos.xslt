<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="2.0">
    
    <xsl:output method="text"/>

    <xsl:template match="instrumento">
        ###  http://www.semanticweb.org/henrique/ontologies/2020/arqmusica#<xsl:choose>
            <xsl:when test="contains(designacao,' ')">
                <xsl:value-of select="substring-before(designacao,' ')"/>_<xsl:value-of select="substring-after(designacao,' ')"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="designacao"/>
            </xsl:otherwise>
        </xsl:choose>
        
        :<xsl:choose>
            <xsl:when test="contains(designacao,' ')">
                <xsl:value-of select="substring-before(designacao,' ')"/>_<xsl:value-of select="substring-after(designacao,' ')"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="designacao"/>
            </xsl:otherwise>
        </xsl:choose> rdf:type owl:NamedIndividual ,
        :instrumento ,
        :obra ;
        :éDeObra :<xsl:value-of select="../../@id"/> ;
        :designacao "<xsl:value-of select="designacao"/>"^^xsd:string ;
        :partitura "<xsl:value-of select="partitura/@path"/>"^^xsd:string .
    </xsl:template>
    
</xsl:stylesheet>