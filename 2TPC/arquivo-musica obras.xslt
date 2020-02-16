<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="2.0">
    
    <xsl:output method="text"/>
    
    <xsl:template match="obra">
        ###  http://www.semanticweb.org/henrique/ontologies/2020/arqmusica#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
        :obra ;<xsl:apply-templates select="instrumentos"/>
        :compositor "<xsl:value-of select="compositor"/>"^^xsd:string ;
        :tipo "<xsl:value-of select="tipo"/>"^^xsd:string ;
        :titulo "<xsl:value-of select="titulo"/>"^^xsd:string .
    </xsl:template>
    
    <xsl:template match="instrumentos">
        :temInstrumento     <xsl:apply-templates select="instrumento"/>
    </xsl:template>
    
    <xsl:template match="instrumento">
        :<xsl:value-of select="../../@id"/>  
        <xsl:choose>
            <xsl:when test="contains(designacao,' ')">
                <xsl:value-of select="substring-before(designacao,' ')"/>_<xsl:value-of select="substring-after(designacao,' ')"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="designacao"/>
            </xsl:otherwise>
        </xsl:choose>
     <xsl:if test="position() != last()">,</xsl:if> <xsl:if test="position() = last()">;</xsl:if>
    </xsl:template>       
    
   
</xsl:stylesheet>